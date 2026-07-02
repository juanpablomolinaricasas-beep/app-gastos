import {
  Briefcase,
  Car,
  CircleDot,
  Coffee,
  Cross,
  Dumbbell,
  Gift,
  GraduationCap,
  Home,
  LucideProps,
  MoreHorizontal,
  PawPrint,
  Plane,
  ShoppingBag,
  Ticket,
  Utensils,
} from 'lucide-react';

// Explicit map (not `import *`) so unused lucide icons stay out of the bundle.
const ICONS: Record<string, typeof CircleDot> = {
  Utensils,
  Car,
  Home,
  Ticket,
  Cross,
  Briefcase,
  MoreHorizontal,
  ShoppingBag,
  Gift,
  Plane,
  Dumbbell,
  GraduationCap,
  PawPrint,
  Coffee,
};

interface Props extends Omit<LucideProps, 'ref'> {
  name: string;
}

export function CategoryIcon({ name, ...props }: Props) {
  const Icon = ICONS[name] ?? CircleDot;
  return <Icon strokeWidth={2} {...props} />;
}
