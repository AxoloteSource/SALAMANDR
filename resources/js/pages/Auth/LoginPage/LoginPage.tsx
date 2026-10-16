import { useAxios } from '@/hooks/useAxios'
import { RoutesApp } from '@/routes/modules/app.routes'
import AuthLayout from '@axolotesource/ui/components/Layouts/AuthLayout/AuthLayout'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm/LoginForm'

const LoginPage = () => {
  const { isAuth } = useAxios()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      navigate(RoutesApp.Home)
    }
  }, [isAuth, navigate])

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage
