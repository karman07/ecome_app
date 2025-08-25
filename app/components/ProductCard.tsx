import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addToCart, removeFromCart } from "@/store/cartSlice";
import { toggleFavorite } from "@/store/favoriteSlice";
import { RootStackParamList, MenuItem } from "@/types/types";
import { LinearGradient } from "expo-linear-gradient";
import { WebView } from "react-native-webview";

type NavigationProps = StackNavigationProp<RootStackParamList, "ProductDetail">;

const ProductCard: React.FC<MenuItem> = ({
  _id,
  name,
  imageUrl,
  price,
  description,
  glbFileUrl,
  usdzFileUrl,
  available,
  restaurantName,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const webViewRef = useRef<WebView>(null);

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((i) => i.productId === _id)
  );
  const favoriteItems = useSelector((state: RootState) => state.favorites.items);

  const [isFavorite, setIsFavorite] = useState<boolean>(
    favoriteItems.includes(_id)
  );
  const [quantity, setQuantity] = useState<number>(cartItem?.quantity || 0);
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [modelError, setModelError] = useState<boolean>(false);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [webViewKey, setWebViewKey] = useState<number>(0);

  // Generate random discount (10-15%)
  const [discount] = useState<number>(Math.floor(Math.random() * 6) + 10);
  const [showDiscount] = useState<boolean>(Math.random() > 0.3);

  // Calculate prices correctly
  const actualPrice = price;
  const fakeOriginalPrice = showDiscount ? Math.round(price + (price * discount / 100)) : price;
  const displayedOriginalPrice = fakeOriginalPrice;
  const displayedDiscountedPrice = actualPrice;

  // Replace old URL with new domain
  const replaceUrl = (url: string): string => {
    if (!url) return url;
    return url.replace("http://93.127.194.249:5000", "https://dine3d.com/api");
  };

  const safeGlbUrl = replaceUrl(glbFileUrl);
  const safeUsdzUrl = replaceUrl(usdzFileUrl);
  const safeImageUrl = replaceUrl(imageUrl);
  const has3D = Boolean(safeGlbUrl || safeUsdzUrl);

  // Reset states when URL changes
  useEffect(() => {
    setModelLoaded(false);
    setModelError(false);
    setShowImage(false);
    if (has3D && safeGlbUrl) {
      setWebViewKey(prev => prev + 1);
    } else {
      setShowImage(true);
    }
  }, [safeGlbUrl, has3D]);

  useEffect(() => {
    setIsFavorite(favoriteItems.includes(_id));
  }, [favoriteItems, _id]);

  useEffect(() => {
    setQuantity(cartItem?.quantity || 0);
  }, [cartItem]);

  const handleFavoriteToggle = (e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(_id));
  };

  const handleCardPress = () => {
    navigation.navigate("ProductDetail", { productId: _id });
  };

  const handleWebViewPress = (e: any) => {
    e.stopPropagation();
  };

  // Navigate to ProductDetail for 3D View (migrated from separate 3D screen)
  const open3DView = (e: any) => {
    e.stopPropagation();
    navigation.navigate("ProductDetail", { 
      productId: _id
    });
  };

  // Handle AR View directly here (no separate AR screen navigation)
  const openAR = (e: any) => {
    e.stopPropagation();
    
    // For iOS devices with USDZ support
    if (Platform.OS === 'ios' && safeUsdzUrl) {
      // Open USDZ file directly in AR Quick Look
      Linking.openURL(safeUsdzUrl).catch(err => {
        console.error('Failed to open USDZ in AR:', err);
        // Fallback to web AR
        openWebAR();
      });
    } else {
      // For Android or when USDZ is not available, use web-based AR
      openWebAR();
    }
  };

  // Web-based AR fallback
  const openWebAR = () => {
    if (!safeGlbUrl && !safeUsdzUrl) {
      Alert.alert('AR Not Available', 'No 3D file available for AR.');
      return;
    }

    // Try iOS USDZ first (Quick Look)
    if (Platform.OS === 'ios' && safeUsdzUrl) {
      Linking.openURL(safeUsdzUrl).catch(() => {
        // fallback to web editor
        const arUrl = `https://modelviewer.dev/editor/?url=${encodeURIComponent(safeGlbUrl || safeUsdzUrl)}`;
        Linking.openURL(arUrl).catch(() => {
          Alert.alert('AR Not Available', 'Unable to open AR on this device.');
        });
      });
      return;
    }

    // Android: try Scene Viewer intent, then fallback to web AR
    if (Platform.OS === 'android' && safeGlbUrl) {
      const sceneViewerIntent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
        safeGlbUrl
      )}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end`;

      Linking.openURL(sceneViewerIntent).catch(() => {
        const arUrl = `https://modelviewer.dev/editor/?url=${encodeURIComponent(safeGlbUrl)}`;
        Linking.openURL(arUrl).catch(() => {
          Alert.alert('AR Not Available', 'Unable to open AR on this device.');
        });
      });
      return;
    }

    // Fallback: open web editor with the available URL
    if (safeGlbUrl || safeUsdzUrl) {
      const arUrl = `https://modelviewer.dev/editor/?url=${encodeURIComponent(safeGlbUrl || safeUsdzUrl)}`;
      Linking.openURL(arUrl).catch(() => {
        Alert.alert('AR Not Available', 'Unable to open AR on this device.');
      });
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);
      
      if (data.type === 'modelLoaded') {
        setModelLoaded(true);
        setModelError(false);
        setShowImage(false);
      } else if (data.type === 'modelError') {
        console.warn('Model failed to load:', data.error);
      } else if (data.type === 'showFallback') {
        setModelLoaded(false);
        setModelError(true);
        setShowImage(false);
      } else if (data.type === 'showImage') {
        setShowImage(true);
        setModelError(false);
        setModelLoaded(false);
      }
    } catch (error) {
      console.warn('Error parsing WebView message:', error);
      setShowImage(true);
    }
  };

  const renderMedia = () => {
    // If no 3D model URL or forced to show image, show image
    if (!has3D || !safeGlbUrl || showImage) {
      if (safeImageUrl) {
        return (
          <Image
            source={{ uri: safeImageUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        );
      }
      return (
        <View style={styles.emptyPlaceholder}>
          <Ionicons name="image-outline" size={32} color="#D1D5DB" />
          <Text style={styles.emptyText}>No preview available</Text>
        </View>
      );
    }

  // Show 3D model with auto-rotation but allow user interaction (camera-controls)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
          <script type="module" src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"></script>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              -webkit-touch-callout: none;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            html, body {
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
              overflow: hidden;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              position: fixed;
              top: 0;
              left: 0;
            }
            
            model-viewer {
              width: 100% !important;
              height: 100% !important;
              background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
              --poster-color: transparent;
              --progress-bar-color: #FF5555;
              --progress-bar-height: 4px;
              --progress-mask: rgba(255, 255, 255, 0.4);
              display: block;
              position: relative;
              z-index: 1;
          /* Completely disable user interaction inside the WebView model-viewer
            so touches are handled by the React Native parent and scrolling
            works as expected. Auto-rotate is still enabled. */
          pointer-events: none;
          touch-action: none;
            }
            
            .loading-overlay {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              z-index: 15;
              transition: all 0.3s ease;
            }
            
            .loading-overlay.hidden {
              opacity: 0;
              visibility: hidden;
              pointer-events: none;
            }
            
            .spinner {
              width: 28px;
              height: 28px;
              border: 3px solid #E5E7EB;
              border-top: 3px solid #FF5555;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 12px;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .loading-text {
              color: #6B7280;
              font-size: 12px;
              font-weight: 600;
              text-align: center;
            }
            
            .error-container {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
              display: none;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              z-index: 20;
              padding: 16px;
            }
            
            .error-icon {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #FF5555, #FF7E5F);
              border-radius: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              margin-bottom: 8px;
              box-shadow: 0 4px 12px rgba(255, 85, 85, 0.3);
            }
            
            .error-message {
              color: #6B7280;
              font-size: 11px;
              text-align: center;
              margin-bottom: 12px;
              line-height: 1.3;
              max-width: 140px;
            }
            
            .retry-btn, .show-image-btn {
              background: linear-gradient(135deg, #FF5555, #FF7E5F);
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 2px 8px rgba(255, 85, 85, 0.3);
              transition: all 0.2s ease;
              margin: 4px;
            }
            
            .show-image-btn {
              background: #6B7280;
              opacity: 0.8;
            }
            
            .model-badge {
              position: absolute;
              top: 8px;
              left: 8px;
              background: rgba(0,0,0,0.75);
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 700;
              z-index: 25;
              backdrop-filter: blur(10px);
            }
          </style>
        </head>
        <body>
          <div id="loadingOverlay" class="loading-overlay">
            <div class="spinner"></div>
            <div class="loading-text">Loading 3D Model...</div>
          </div>
          
          <div id="errorContainer" class="error-container">
            <div class="error-icon">📦</div>
            <div class="error-message">3D model unavailable</div>
            <button class="retry-btn" onclick="retryLoad()">Retry</button>
            <button class="show-image-btn" onclick="showImageFallback()">Show Image</button>
          </div>
          
          <div class="model-badge">3D</div>
          
          <model-viewer 
            id="modelViewer"
            src="${safeGlbUrl}"
            alt="3D model of ${name}"
            auto-rotate
            auto-rotate-delay="0"
            rotation-per-second="45deg"
            camera-controls="false"
            shadow-intensity="0.8"
            shadow-softness="1"
            exposure="1.3"
            environment-image="neutral"
            camera-orbit="0deg 80deg 120%"
            field-of-view="30deg"
            loading="eager"
            reveal="auto"
            interaction-prompt="none"
            camera-target="auto auto auto"
            bounds="tight">
          </model-viewer>

          <script>
            console.log('3D Model Viewer - AUTO-ROTATE ONLY MODE for:', "${name}");
            console.log('Model URL:', "${safeGlbUrl}");
            
            const modelViewer = document.getElementById('modelViewer');
            const loadingOverlay = document.getElementById('loadingOverlay');
            const errorContainer = document.getElementById('errorContainer');
            let loadTimeout;
            let errorTimeout;
            let isModelLoaded = false;
            let hasShownError = false;

            function postMessage(data) {
              try {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(data));
                  console.log('Posted message:', data);
                }
              } catch (e) {
                console.warn('Failed to post message:', e);
              }
            }

            function hideLoading() {
              loadingOverlay.classList.add('hidden');
              setTimeout(() => {
                loadingOverlay.style.display = 'none';
              }, 300);
            }

            function showError() {
              if (hasShownError) return;
              hasShownError = true;
              console.log('Showing error UI');
              loadingOverlay.style.display = 'none';
              errorContainer.style.display = 'flex';
              postMessage({ type: 'showFallback', reason: 'load_failed' });
            }

            function showImageFallback() {
              console.log('User requested image fallback');
              postMessage({ type: 'showImage' });
            }

            function retryLoad() {
              console.log('Retrying model load');
              hasShownError = false;
              isModelLoaded = false;
              errorContainer.style.display = 'none';
              loadingOverlay.style.display = 'flex';
              loadingOverlay.classList.remove('hidden');
              
              clearTimeout(loadTimeout);
              clearTimeout(errorTimeout);
              
              const currentSrc = modelViewer.src;
              modelViewer.src = '';
              setTimeout(() => {
                modelViewer.src = currentSrc + '?retry=' + Date.now();
                startTimeouts();
              }, 100);
            }

            function startTimeouts() {
              loadTimeout = setTimeout(() => {
                if (!isModelLoaded) {
                  console.log('Load timeout - showing error');
                  showError();
                }
              }, 15000);

              errorTimeout = setTimeout(() => {
                if (!isModelLoaded && !hasShownError) {
                  console.log('Secondary timeout - showing error');
                  showError();
                }
              }, 20000);
            }

            // Start timeouts
            startTimeouts();

            // Force continuous auto-rotation
            function enableContinuousRotation() {
              if (modelViewer) {
                modelViewer.autoRotate = true;
                modelViewer.autoRotateDelay = 0;
                modelViewer.rotationPerSecond = '12deg';
              }
            }

            // Model viewer event listeners
            modelViewer.addEventListener('load', (event) => {
              console.log('Model loaded - ENABLING CONTINUOUS ROTATION');
              isModelLoaded = true;
              clearTimeout(loadTimeout);
              clearTimeout(errorTimeout);
              hideLoading();
              
              // FORCE CONTINUOUS AUTO-ROTATION
              enableContinuousRotation();
              
              postMessage({ 
                type: 'modelLoaded', 
                loadTime: Date.now(),
                url: modelViewer.src 
              });
              
              // Set camera and ensure rotation continues
              setTimeout(() => {
                try {
                  modelViewer.cameraOrbit = '0deg 80deg 120%';
                  enableContinuousRotation();
                } catch (e) {
                  console.warn('Camera positioning failed:', e);
                }
              }, 500);
            });

            modelViewer.addEventListener('error', (event) => {
              console.error('Model load error:', event.detail);
              if (!isModelLoaded) {
                postMessage({ 
                  type: 'modelError', 
                  error: event.detail?.message || 'Load failed',
                  url: modelViewer.src
                });
              }
            });

            modelViewer.addEventListener('progress', (event) => {
              const progress = event.detail.totalProgress;
              if (progress === 1 && !isModelLoaded) {
                isModelLoaded = true;
                clearTimeout(loadTimeout);
                clearTimeout(errorTimeout);
                hideLoading();
                enableContinuousRotation();
                postMessage({ type: 'modelLoaded', loadTime: Date.now() });
              }
            });

            // CONTINUOUS ROTATION MONITOR - gently ensure rotation remains enabled
            setInterval(() => {
              if (isModelLoaded && modelViewer) {
                try { enableContinuousRotation(); } catch(e){}
              }
            }, 2000);

            // Global error handler
            window.addEventListener('error', (event) => {
              console.error('Window error:', event.error);
            });

            console.log('3D Model Viewer initialized (auto-rotate + camera-controls)');
          </script>
        </body>
      </html>
    `;
    return (
      <View style={styles.webViewContainer} pointerEvents="box-none">
        <WebView
          key={webViewKey}
          ref={webViewRef}
          style={styles.webView}
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState={false}
          onMessage={handleWebViewMessage}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
            setShowImage(true);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView HTTP error: ', nativeEvent);
            setShowImage(true);
          }}
          mixedContentMode="compatibility"
          allowsFullscreenVideo={false}
          bounces={false}
          /* allow nested scrolling on Android and let the web content handle gestures */
          nestedScrollEnabled={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          cacheEnabled={false}
  />
        {!modelLoaded && !modelError && !showImage && (
          <View style={styles.webViewLoader}>
            <ActivityIndicator size="small" color="#FF5555" />
            <Text style={styles.loadingText}>Loading 3D model...</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={styles.card}
      activeOpacity={0.95}
    >
      {/* Discount Badge */}
      {showDiscount && (
        <View style={styles.discountBadge}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E8E"]}
            style={styles.discountGradient}
          >
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </LinearGradient>
        </View>
      )}

      <View style={styles.mediaWrap}>
        {renderMedia()}
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.heartIcon}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color="#FF5555"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {restaurantName ? (
          <Text style={styles.restaurant} numberOfLines={1}>
            {restaurantName}
          </Text>
        ) : null}
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            {showDiscount ? (
              <>
                <Text style={styles.originalPrice}>₹{displayedOriginalPrice}</Text>
                <Text style={styles.discountedPrice}>₹{displayedDiscountedPrice}</Text>
              </>
            ) : (
              <Text style={styles.price}>₹{actualPrice}</Text>
            )}
          </View>
          <View style={styles.actions}>
            {quantity > 0 ? (
              <>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    dispatch(removeFromCart({ productId: _id }));
                  }}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color="#FF5555"
                  />
                </TouchableOpacity>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    dispatch(addToCart({ productId: _id }));
                  }}
                  style={styles.iconButton}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#FF5555" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  dispatch(addToCart({ productId: _id }));
                }}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={["#FF7E5F", "#FD3A69"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cartButton}
                >
                  <Ionicons name="cart" size={18} color="#FFF" />
                  <Text style={styles.cartButtonText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 3D and AR Action Buttons */}
        {has3D && !modelError && !showImage && (
          <View style={styles.actionButtonsContainer}>
            {/* 3D View Button - Navigate to ProductDetail with 3D mode flag */}
            <TouchableOpacity style={styles.viewButton} onPress={open3DView}>
              <Ionicons name="cube-outline" size={16} color="#fff" />
              <Text style={styles.viewButtonText}>3D View</Text>
            </TouchableOpacity>
            
            {/* AR View Button - Handle AR directly here */}
            <TouchableOpacity style={styles.arButton} onPress={openAR}>
              <Ionicons name="camera-outline" size={16} color="#fff" />
              <Text style={styles.arButtonText}>AR View</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: 240,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 16,
    marginRight: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    position: "relative",
  },
  discountBadge: {
    position: "absolute",
    top: -5,
    left: -5,
    zIndex: 30,
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  discountGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderTopRightRadius: 4,
  },
  discountText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  mediaWrap: {
    width: "100%",
    height: 180,
    borderRadius: 15,
    backgroundColor: "#F8F9FA",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  webViewContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    backgroundColor: "#F8F9FA",
  },
  webView: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  webViewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    zIndex: 5,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "600",
  },
  image: { 
    width: "100%", 
    height: "100%" 
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 6,
    zIndex: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  emptyPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { 
    color: "#9CA3AF", 
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
  info: { 
    width: "100%", 
    marginTop: 12,
    alignItems: "center" 
  },
  name: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1F2937",
    textAlign: "center",
  },
  restaurant: { 
    fontSize: 12, 
    color: "#6B7280",
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: "#4B5563",
    marginVertical: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
  },
  priceContainer: {
    alignItems: "flex-start",
  },
  price: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#FF5555" 
  },
  originalPrice: {
    fontSize: 14,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  discountedPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FF5555",
    marginTop: 2,
  },
  actions: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  iconButton: { 
    backgroundColor: "transparent", 
    marginHorizontal: 3, 
    padding: 4 
  },
  cartButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: "#FD3A69",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cartButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 6,
  },
  quantity: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginHorizontal: 8,
    minWidth: 24,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
    gap: 8,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  viewButtonText: { 
    color: "#FFF", 
    fontWeight: "700", 
    fontSize: 12, 
    marginLeft: 4
  },
  arButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F97316",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    justifyContent: "center",
    shadowColor: "#F97316",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  arButtonText: { 
    color: "#FFF", 
    fontWeight: "700", 
    fontSize: 12, 
    marginLeft: 4
  },
});