'use client';

import { useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Portal({ children }: PortalProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  if (!isMounted) return null;

  return createPortal(children, document.body);
}