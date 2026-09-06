/* Cross-floor echoes are visual recurrences of existing typed contacts.
 * They never introduce a scientific edge and never change contact status. */
window.ZUIZUI_TOWER_ECHOES = Object.freeze([
  Object.freeze({
    id:'record-boundary', rune:'split', unlock:'record',
    from:'tnoa', to:'boundary', contact:'observation-map'
  }),
  Object.freeze({
    id:'boundary-evidence', rune:'gate', unlock:'state',
    from:'boundary', to:'ced', contact:'evidence-license'
  }),
  Object.freeze({
    id:'evidence-future', rune:'fork', unlock:'state',
    from:'ced', to:'egwee', contact:'natural-state'
  }),
  Object.freeze({
    id:'candidate-field', rune:'return', unlock:'answer',
    from:'acsp', to:'aza3', contact:'field-return'
  }),
  Object.freeze({
    id:'island-future', rune:'mirror', unlock:'future',
    from:'island', to:'egwee', contact:'island-urban'
  })
]);
