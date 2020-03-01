import Delivery from '../models/Delivery';
import File from '../models/File';

class DeliveryEndDateController {
  async update(req, res) {
    const { id } = await Delivery.findByPk(req.params.deliveryId);
    const { originalname: name, filename: path } = req.file;
    const file = await File.create({ name, path });

    await Delivery.update(
      { signature_id: file.id, end_date: new Date() },
      { where: { id } }
    );

    return res.json({ Success: `Delivery ${id} is now with de recipient` });
  }
}

export default new DeliveryEndDateController();
