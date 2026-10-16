import IRoute from '@/interfaces/IRoute'
import { lazy } from 'react'

const HomePage = lazy(() => import('@/pages/Backoffice/HomePage/HomePage'))
const DashboardPage = lazy(() => import('@/pages/Dashboard/DashboardPage'))

export enum RoutesApp {
  Home = '/',
  Dashboard = '/dashboard'
}

export const appRoutes: IRoute[] = [
  {
    path: RoutesApp.Home,
    element: <HomePage />
  },
  {
    path: RoutesApp.Dashboard,
    element: <DashboardPage />
  }
]
