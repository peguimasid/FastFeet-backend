import Mail from '../../lib/Mail';

class NewDelivery {
  get key() {
    return 'NewDelivery';
  }

  async handle({ data }) {
    const { deliveryman, delivery, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Voce tem uma nova encomenda!`,
      template: 'newdelivery',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        name: recipient.nome,
        street: recipient.rua,
        number: recipient.numero,
        comp: recipient.complemento,
        state: recipient.estado,
        city: recipient.cidade,
        cep: recipient.cep,
      },
    });
  }
}

export default new NewDelivery();
