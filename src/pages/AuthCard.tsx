interface AuthCardProps {
    children: React.ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
    return (
        <div className="flex min-h-screen flex-col bg-background md:items-center md:justify-center">
            <div className="w-full bg-white px-6 pb-[74px] md:w-[576px] md:rounded-md md:p-12 md:shadow-card">
                {children}
            </div>
        </div>
    );
};
