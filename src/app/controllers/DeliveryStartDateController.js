import { isWithinInterval } from 'date-fns';
import { Op } from 'sequelize';

import Delivery from '../models/Delivery';

class DeliveryStartDateController {
  async update(req, res) {
    const { id } = await Delivery.findByPk(req.params.deliveryId);
    const { deliveryman_id } = req.body;

    if (!deliveryman_id) {
      return res.status(400).json({ error: 'Please chose a deliveryman' });
    }

    // Verificar se esta entre 8:00 e 18:00 hrs
    const now = new Date();
    const morning = new Date().setHours(8, 0, 0);
    const afternoon = new Date().setHours(18, 0, 0);
    const periodValid = isWithinInterval(now, {
      start: morning,
      end: afternoon,
    });

    if (!periodValid) {
      return res.status(400).json({
        error: 'You can only pickup deliveries between 8 AM and 6 PM ',
      });
    }

    // Verificar se ele ja passou de 5 retiradas diarias
    const today_start = new Date().setHours(0, 0, 0, 0);
    const retiradas = await Delivery.count({
      where: {
        deliveryman_id,
        start_date: { [Op.gt]: today_start, [Op.lt]: now },
      },
    });
    if (retiradas >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only make 5 deliverys per day' });
    }

    const startDate = await Delivery.update(
      { start_date: now },
      { where: { id } }
    );

    return res.json(startDate);
  }
}

export default new DeliveryStartDateController();
