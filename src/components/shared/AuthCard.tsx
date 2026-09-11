interface AuthCardProps {
    children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
    return (
      <div className="w-full bg-[#FFFFFF] px-6 pb-[74px] md:w-[576px] md:rounded-md md:p-12 md:shadow-card">
                {children}
            </div>
       
    );
};
