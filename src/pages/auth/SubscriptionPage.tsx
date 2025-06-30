
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { CheckIcon } from '../../components/common/Icons'; // Explicitly importing if it was separate
import AuthLayout from '../../components/layout/AuthLayout';

interface Plan {
  id: string;
  name: string;
  price: string;
  priceSuffix: string;
  features: string[];
  tag?: string;
}

const plansData: Plan[] = [
  { id: 'basic', name: 'Basic', price: '$0', priceSuffix: '/month', tag: 'Free', features: ['Up to 5 devices', 'Basic security features', 'Email support'] },
  { id: 'standard', name: 'Standard', price: '$10', priceSuffix: '/month', features: ['Up to 20 devices', 'Advanced security features', 'Priority email support'] },
  { id: 'premium', name: 'Premium', price: '$25', priceSuffix: '/month', tag: 'Best Value', features: ['Unlimited devices', 'Enterprise-grade security', '24/7 phone support'] },
];

interface PaymentFormData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
}

const SubscriptionPage: React.FC = () => {
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(plansData[0].id);
    const [paymentForm, setPaymentForm] = useState<PaymentFormData>({ cardNumber: '', expiryDate: '', cvv: '', nameOnCard: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { completeSubscription } = useAuth();

    const handlePlanSelect = (planId: string) => {
        setSelectedPlanId(planId);
    };

    const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlanId) {
            setError('Por favor, seleccione un plan.');
            return;
        }
        if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.nameOnCard) {
            setError('Por favor, complete todos los campos de pago.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await completeSubscription(selectedPlanId, paymentForm);
        } catch (err: any) {
            setError((err as Error).message || 'Error al procesar la suscripción.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Elige tu Plan y Suscríbete" wideCard>
            <div className="w-full px-2 py-3 flex flex-col flex-grow min-h-0"> {/* Make this flex-col and grow */}
                <div className="flex-grow overflow-y-auto pr-1"> {/* Scrollable area for content */}
                    <h2 className="text-auth-textPrimary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Planes Disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
                        {plansData.map(plan => (
                            <div 
                                key={plan.id}
                                className={`flex flex-1 flex-col gap-4 rounded-xl border border-solid p-6 cursor-pointer transition-all
                                            ${selectedPlanId === plan.id ? 'border-auth-buttonPrimaryBg ring-2 ring-auth-buttonPrimaryBg bg-blue-50' : 'border-borderClr bg-surface hover:border-gray-400'}`}
                                onClick={() => handlePlanSelect(plan.id)}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <h1 className="text-auth-textPrimary text-base font-bold leading-tight">{plan.name}</h1>
                                        {plan.tag && <p className="text-auth-textPrimary text-xs font-medium leading-normal tracking-[0.015em] rounded-full bg-blue-200 px-3 py-[3px] text-center">{plan.tag}</p>}
                                    </div>
                                    <p className="flex items-baseline gap-1 text-auth-textPrimary">
                                        <span className="text-auth-textPrimary text-4xl font-black leading-tight tracking-[-0.033em]">{plan.price}</span>
                                        <span className="text-auth-textPrimary text-base font-bold leading-tight">{plan.priceSuffix}</span>
                                    </p>
                                </div>
                                <Button 
                                    type="button" 
                                    variant={selectedPlanId === plan.id ? "authPrimary" : "neutral"} 
                                    className="w-full mt-auto"
                                    onClick={(e) => { e.stopPropagation(); handlePlanSelect(plan.id); }}
                                >
                                    {selectedPlanId === plan.id ? "Plan Seleccionado" : "Seleccionar Plan"}
                                </Button>
                                <div className="flex flex-col gap-2 mt-2">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="text-[13px] font-normal leading-normal flex gap-3 text-auth-textPrimary items-center">
                                            <CheckIcon className="text-green-500 w-5 h-5 flex-shrink-0" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-auth-textPrimary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-8">Método de Pago</h2>
                    <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
                        <Input label="Número de Tarjeta" name="cardNumber" type="text" placeholder="Ingrese el número de tarjeta" value={paymentForm.cardNumber} onChange={handlePaymentChange} isAuthPage required />
                        <div className="flex items-start gap-4">
                            <div className="w-2/5">
                                <Input label="Fecha de Expiración" name="expiryDate" type="text" placeholder="MM/AA" value={paymentForm.expiryDate} onChange={handlePaymentChange} isAuthPage required />
                            </div>
                            <div className="w-3/5">
                                <Input label="CVV" name="cvv" type="text" placeholder="Ingrese CVV" value={paymentForm.cvv} onChange={handlePaymentChange} isAuthPage required />
                            </div>
                        </div>
                        <Input label="Nombre en la Tarjeta" name="nameOnCard" type="text" placeholder="Ingrese el nombre como aparece en la tarjeta" value={paymentForm.nameOnCard} onChange={handlePaymentChange} isAuthPage required />
                        
                        {error && <p className="text-sm text-red-500 text-center py-2">{error}</p>}
                        <div className="pt-4">
                            <Button type="submit" isLoading={isLoading} variant="authPrimary" size="auth" className="w-full">
                                Suscribirse y Pagar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
};

export default SubscriptionPage;