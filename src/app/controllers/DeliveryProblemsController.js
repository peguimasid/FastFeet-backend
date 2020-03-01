import DeliveryProblem from '../models/DeliveryProblems';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Queue from '../../lib/Queue';
import CancelationDelivery from '../jobs/CancelationDelivery';

class DeliveryProblemsController {
  async store(req, res) {
    const { deliveryId } = req.params;
    const { description } = req.body;
    const problem = await DeliveryProblem.create({
      delivery_id: deliveryId,
      description,
    });
    return res.json(problem);
  }

  async index(req, res) {
    const { deliveryId } = req.params;
    let problems = [];
    if (deliveryId) {
      problems = await DeliveryProblem.findAll({
        where: { delivery_id: deliveryId },
      });
    } else {
      problems = await DeliveryProblem.findAll();
    }
    return res.json(problems);
  }

  async delete(req, res) {
    const { deliveryId } = req.params;
    const problem = await DeliveryProblem.findByPk(deliveryId);

    if (!problem) {
      return res.json({ error: 'Cannot cancel. Wrong delivery problem.' });
    }

    Delivery.update(
      { canceled_at: new Date() },
      { where: { id: problem.delivery_id } }
    );

    const delivery = await Delivery.findOne({
      where: { id: problem.delivery_id },
      attributes: ['product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        { model: Recipient, as: 'recipient', attributes: ['nome'] },
      ],
    });

    await Queue.add(CancelationDelivery.key, {
      delivery,
      problem,
    });

    return res.json(delivery);
  }
}

export default new DeliveryProblemsController();
