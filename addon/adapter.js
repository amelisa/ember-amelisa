import BaseAdapter from 'ember-data/adapter';
import getModel from 'npm:amelisa/lib/react/getModel'; // jshint ignore:line
import amelisaMongo from 'npm:amelisa/mongo'; // jshint ignore:line
import Ember from 'ember';

const {
  RSVP,
  String: {pluralize}
} = Ember;

export default BaseAdapter.extend({
  serializeModelName: pluralize,

  updateStoreOnChange (store, modelClass, payload, id, requestType) {
    const modelName = modelClass.modelName
    const serializer = store.serializerFor(modelName);
    const normalizedPayload = serializer.normalizeResponse (store, modelClass, payload, id, requestType)

    store.push(normalizedPayload)
  },

  init () {
    this._super(...arguments)

    let amelisaModel = getModel({dbQueries: amelisaMongo.dbQueries, url: 'ws://localhost:4201'})
    let amelisaReady = amelisaModel.onReady()
    this.setProperties({amelisaModel, amelisaReady})
  },

  findRecord() {},

  createRecord() {},

  updateRecord(store, modelClass, snapshot) {
    let modelName = modelClass.modelName
    let serializedModelName = this.serializeModelName(modelName)
    let id = snapshot.id
    let amelisaModel = this.get('amelisaModel')
    let amelisaReady = this.get('amelisaReady')
    let payload = this.serialize(snapshot, { includeId: true });
    let deferred = RSVP.defer()

    amelisaReady
      .then(() => model.set([serializedModelName, id], payload) )
      .then(() => model.get(serializedModelName, id))
      .then(deferred.resolve)
      .catch(deferred.reject)

    return deferred.promise
  },

  deleteRecord() {},

  findAll(store, modelClass/*, sinceToken, snapshotRecordArray*/) {
    let modelName = modelClass.modelName
    let serializedModelName = this.serializeModelName(modelName)
    let amelisaModel = this.get('amelisaModel')
    let amelisaReady = this.get('amelisaReady')
    let deferred = RSVP.defer()
    let query = amelisaModel.query(serializedModelName, {})

    query.on('change', () => {
      let payload = query.get()
      console.log('change', payload)
      this.updateStoreOnChange(store, modelClass, payload, null, 'findAll')
    })

    amelisaReady
      .then(() => query.subscribe() )
      .then(() => query.get() )
      .then(deferred.resolve)
      .catch(deferred.reject)

    return deferred.promise
  },
  query() {}
});
