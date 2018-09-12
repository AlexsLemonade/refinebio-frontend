/**
 * This class receives two components and decides which one to render based on the type of device the user has
 * To make this truly responsive, this component would have to react to changes in the width of the browser window
 * but for now we don't need this.
 *
 * ref https://goshakkk.name/different-mobile-desktop-tablet-layouts-react/
 */
export default function ResponsiveSwitch({ mobile, desktop }) {
  if (isMobile()) {
    return mobile();
  } else {
    return desktop();
  }
}

export function isMobile() {
  return window.innerWidth < 1024;
}
