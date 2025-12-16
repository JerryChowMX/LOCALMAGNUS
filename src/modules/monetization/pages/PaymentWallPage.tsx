
import { useAuth } from '../../../context/AuthContext';
import { LogOut } from 'lucide-react';

export const PaymentWallPage = () => {
    const { logout, user } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold">Tu periodo de prueba terminó</h1>
                <p className="text-gray-400">
                    Hola {user?.name}, esperamos que hayas disfrutado MAGNUS. <br />
                    Para continuar leyendo, necesitas una suscripción activa.
                </p>

                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 my-8">
                    <div className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2">Acceso Total</div>
                    <div className="text-4xl font-bold mb-1">$9.99 <span className="text-lg font-normal text-gray-500">/ mes</span></div>
                    <p className="text-sm text-gray-500 mb-6">Cancela cuando quieras.</p>

                    <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        Suscribirse Ahora
                    </button>
                    <p className="text-xs text-gray-600 mt-4">
                        Pagos seguros procesados por Stripe.
                    </p>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 hover:text-white transition-colors"
                >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};
