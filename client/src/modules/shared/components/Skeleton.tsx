import { ReactNode } from 'react';
import { Skeleton as ShadCnSkeleton } from '@/ui/skeleton.tsx';

type SkeletonProps = {
	children: ReactNode;
	isLoading: boolean;
	className?: string;
};

export const Skeleton = ({ children, isLoading, className }: SkeletonProps) =>
	isLoading ? <ShadCnSkeleton className={className} /> : children;
