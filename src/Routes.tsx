export const ROUTES = {
  Home: '/',
  Patients: '/patients',
  Patient: '/patients/:id',
} as const;
export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
  Home: "Главная",
  Patients: "Пациенты",
  Patient: "Пациент"
};