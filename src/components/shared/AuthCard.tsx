interface AuthCardProps {
  children: React.ReactNode
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="md:shadow-card bg-authcard w-full px-6 pb-(--layout-auth-padding-bottom) md:w-(--layout-auth-width) md:rounded-md md:p-12">
      {children}
    </div>
  )
}
