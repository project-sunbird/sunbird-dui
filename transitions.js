exports.animParams = {
  LinearIn: {
    a_duration: "400",
    a_scaleX: 0.7,
    a_scaleY: 0.7,
    a_alpha: 0
  },
  LinearOut: {
    translationX: '2000',
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    a_translationX: '0',
    a_duration: "400",
    bringToFront: 'true'
  },
  PushOut: {
    translationX: '1000',
    a_scaleX: 1,
    a_scaleY: 1,
    alpha: 1,
    a_translationX: '0',
    a_duration: "300",
    bringToFront: 'true'
  },
  PushIn: {
    a_alpha: 0
  },
  FlipOut: {
    a_duration: "400",
    a_scaleX: 1,
    a_scaleY: 1,
    a_alpha: 1,
    bringToFront: 'true'
  },
  FlipIn: {
    scaleX: 0,
    scaleY: 1,
    a_alpha: 0
  },
  EaseOut: {
    translationY: '2000',
    scaleX: 1,
    scaleY: 1,
    alpha: 1,
    a_translationY: '0',
    a_duration: "300",
    bringToFront: 'true',
    id: '0'
  },
  EaseIn: {
    a_duration: "400",
    a_scaleX: 0.2,
    a_scaleY: 0.2,
    a_alpha: 0,
    id: '0'
  },
  FadeOut: {
    a_duration: "400",
    a_scaleX: 1,
    a_scaleY: 1,
    a_alpha: 1,

  },
  FadeIn: {
    a_alpha: 0,
  }
}
