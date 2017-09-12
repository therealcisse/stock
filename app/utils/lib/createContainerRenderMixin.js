import ReactDOM from 'react-dom';

function defaultGetContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

export default function createContainerRenderMixin(config) {
  const {
    autoMount = true,
    autoDestroy = true,
    isVisible,
    getComponent,
    getContainer = defaultGetContainer,
  } = config;

  let mixin;

  function renderComponent(instance, componentArg, ready) {
    if (!isVisible || instance._component || isVisible(instance)) {
      if (!instance._container) {
        instance._container = getContainer(instance);
      }
      let component;
      if (instance.getComponent) {
        component = instance.getComponent(componentArg);
      } else {
        component = getComponent(instance, componentArg);
      }
      ReactDOM.unstable_renderSubtreeIntoContainer(
        instance,
        component,
        instance._container,
        function callback() {
          instance._component = this;
          if (ready) {
            ready.call(this);
          }
        },
      );
    }
  }

  if (autoMount) {
    mixin = {
      ...mixin,
      componentDidMount() {
        renderComponent(this);
      },
      componentDidUpdate() {
        renderComponent(this);
      },
    };
  }

  if (!autoMount || !autoDestroy) {
    mixin = {
      ...mixin,
      renderComponent(componentArg, ready) {
        renderComponent(this, componentArg, ready);
      },
    };
  }

  function removeContainer(instance) {
    if (instance._container) {
      const container = instance._container;
      ReactDOM.unmountComponentAtNode(container);
      container.parentNode.removeChild(container);
      instance._container = null;
    }
  }

  if (autoDestroy) {
    mixin = {
      ...mixin,
      componentWillUnmount() {
        removeContainer(this);
      },
    };
  } else {
    mixin = {
      ...mixin,
      removeContainer() {
        removeContainer(this);
      },
    };
  }

  return Component => {
    Object.keys(mixin).forEach(key => {
      const superCall = Component.prototype[key];
      const func = mixin[key];
      Object.defineProperty(Component.prototype, key, {
        value: function(...args) {
          superCall && superCall.call(this, ...args);
          func.call(this, ...args);
        },
      });
    });
    return Component;
  };
}
