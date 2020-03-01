import Delivery from '../models/Delivery';

class DeliverymanOpenDeliveriesController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const { deliverymanId } = req.params;

    const openDeliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliverymanId,
        end_date: null,
        canceled_at: null,
      },
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'start_date',
        'created_at',
        'signature_id',
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(openDeliveries);
  }
}

export default new DeliverymanOpenDeliveriesController();
