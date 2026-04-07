export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  create(data) {
    return this.model.create(data);
  }

  findById(id) {
    return this.model.findById(id);
  }

  findOne(query) {
    return this.model.findOne(query);
  }

  find(query) {
    return this.model.find(query);
  }

  update(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  updateOne(query, data) {
    return this.model.updateOne(query, data);
  }

  delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(query) {
    return this.model.deleteMany(query);
  }
}
