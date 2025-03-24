declare module 'react-native-typewriter' {
    import { Component } from 'react';
    
    interface TypeWriterProps {
      text: string;
      typing?: number; // 1 = Start, 0 = Stop
      delay?: number; // Delay per character
      minDelay?: number;
      maxDelay?: number;
      fixed?: boolean; // Ensures text is displayed completely at the end
      onTypingEnd?: () => void;
    }
  
    export default class TypeWriter extends Component<TypeWriterProps> {}
  }
  