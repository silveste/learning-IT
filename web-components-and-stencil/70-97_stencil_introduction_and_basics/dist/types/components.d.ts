/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from './stencil.core';


export namespace Components {
  interface MyComponent {
    /**
    * The first name
    */
    'first': string;
    /**
    * The last name
    */
    'last': string;
    /**
    * The middle name
    */
    'middle': string;
  }
  interface SeSideDrawer {
    'open': () => Promise<void>;
    'opened': boolean;
    'title': string;
  }
  interface SeTooltip {
    'tip': string;
  }
}

declare global {


  interface HTMLMyComponentElement extends Components.MyComponent, HTMLStencilElement {}
  var HTMLMyComponentElement: {
    prototype: HTMLMyComponentElement;
    new (): HTMLMyComponentElement;
  };

  interface HTMLSeSideDrawerElement extends Components.SeSideDrawer, HTMLStencilElement {}
  var HTMLSeSideDrawerElement: {
    prototype: HTMLSeSideDrawerElement;
    new (): HTMLSeSideDrawerElement;
  };

  interface HTMLSeTooltipElement extends Components.SeTooltip, HTMLStencilElement {}
  var HTMLSeTooltipElement: {
    prototype: HTMLSeTooltipElement;
    new (): HTMLSeTooltipElement;
  };
  interface HTMLElementTagNameMap {
    'my-component': HTMLMyComponentElement;
    'se-side-drawer': HTMLSeSideDrawerElement;
    'se-tooltip': HTMLSeTooltipElement;
  }
}

declare namespace LocalJSX {
  interface MyComponent extends JSXBase.HTMLAttributes<HTMLMyComponentElement> {
    /**
    * The first name
    */
    'first'?: string;
    /**
    * The last name
    */
    'last'?: string;
    /**
    * The middle name
    */
    'middle'?: string;
  }
  interface SeSideDrawer extends JSXBase.HTMLAttributes<HTMLSeSideDrawerElement> {
    'opened'?: boolean;
    'title'?: string;
  }
  interface SeTooltip extends JSXBase.HTMLAttributes<HTMLSeTooltipElement> {
    'tip'?: string;
  }

  interface IntrinsicElements {
    'my-component': MyComponent;
    'se-side-drawer': SeSideDrawer;
    'se-tooltip': SeTooltip;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


