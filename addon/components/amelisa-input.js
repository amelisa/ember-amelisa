import Ember from 'ember';
import layout from '../templates/components/amelisa-input';

const {
  Component,
  computed
} = Ember;

export default Component.extend({

  layout,



  // ----- Arguments -----
  model: null,
  attrPath: null,

  actions: {
    update (newValue) {
      console.log('save',newValue)
      const model = this.get('model')
      const attrPath = this.get('attrPath')
      model.set(attrPath, newValue)
      model.save()
    }
  }
});
