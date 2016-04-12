import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({

  normalize(modelClass, resourceHash) {
    resourceHash.id = resourceHash._id;
    delete resourceHash._id;

    return this._super(modelClass, resourceHash)
  },

  serialize(snapshot, options) {
    const payload = this._super(snapshot, options)

    payload._id = payload.id;
    delete payload.id;

    return payload
  }
});
