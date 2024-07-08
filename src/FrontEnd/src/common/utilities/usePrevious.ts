/**
 * Borrowed from: https://github.com/sergeyleschev/react-custom-hooks/blob/main/src/hooks/usePrevious/usePrevious.js
 */

import { useRef } from 'react';

export default function usePrevious<T>(value: T) {
    const currentRef = useRef<T>(value);
    const previousRef = useRef<T>();

    if (currentRef.current !== value) {
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }

    return previousRef.current;
}

