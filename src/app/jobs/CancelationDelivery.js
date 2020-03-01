import Mail from '../../lib/Mail';

class CancelationDelivery {
  get key() {
    return 'CancelationDelivery';
  }

  async handle({ data }) {
    const { delivery, problem } = data;

    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'cancelation_delivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        product: delivery.product,
        recipient: delivery.recipient.nome,
        motivo: problem.description,
      },
    });
  }
}

export default new CancelationDelivery();
