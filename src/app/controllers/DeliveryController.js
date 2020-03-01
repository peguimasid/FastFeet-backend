import * as Yup from 'yup';
import Recipient from '../models/Recipient';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Queue from '../../lib/Queue';
import NewDelivery from '../jobs/NewDelivery';

class DeliveryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      recipient_id: Yup.number().required(),
      product: Yup.string().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      deliveryman_id,
      recipient_id,
      product,
      start_date,
      end_date,
    } = req.body;

    const isDeliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    const isRecipient = await Recipient.findOne({
      where: { id: recipient_id },
    });

    if (!isDeliveryman) {
      return res
        .status(401)
        .json({ error: 'You can only post deliveries with deliverymans' });
    }

    if (!isRecipient) {
      return res.status(401).json({ error: 'This recipient does not exists' });
    }

    const delivery = await Delivery.create({
      id,
      deliveryman_id,
      recipient_id,
      product,
      start_date,
      end_date,
    });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    await Queue.add(NewDelivery.key, {
      deliveryman,
      recipient,
      delivery,
    });

    return res.json(delivery);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number(),
      recipient_id: Yup.number(),
      product: Yup.string(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const delivery = await Delivery.findByPk(req.params.deliveryId);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.update(req.body);
    return res.status(201).json(req.body);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const deliverys = await Delivery.findAll({
      attributes: [
        'id',
        `deliveryman_id`,
        `recipient_id`,
        `product`,
        `start_date`,
        `end_date`,
      ],
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(deliverys);
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.deliveryId);

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.destroy(delivery);

    return res.status(200).json({ Success: 'Delivery deleted' });
  }
}

export default new DeliveryController();
