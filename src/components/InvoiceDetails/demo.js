// import React from 'react';
// import ReactDOM from 'react-dom';
// import Popover from 'your-popover-library';

// class PrintPopover extends React.Component {
//   componentDidMount() {
//     window.addEventListener('afterprint', this.handleAfterPrint);
//   }

//   componentWillUnmount() {
//     window.removeEventListener('afterprint', this.handleAfterPrint);
//   }

//   handlePrintClick = () => {
//     window.print();
//   };

//   handleAfterPrint = () => {
//     // Render the popover after printing is completed
//     ReactDOM.render(
//       <Popover>
//         <div>Print completed!</div>
//       </Popover>,
//       document.getElementById('popover-root')
//     );
//   };

//   render() {
//     return (
//       <div>
//         <button onClick={this.handlePrintClick}>Print</button>
//         <div id="popover-root"></div>
//       </div>
//     );
//   }
// }

// ReactDOM.render(<PrintPopover />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import Popover from 'your-popover-library';
import Drawer from 'your-drawer-library';

class PrintPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopoverVisible: false,
      isDrawerVisible: false,
      popoverContent: '',
    };
  }

  componentDidMount() {
    window.addEventListener('afterprint', this.handleAfterPrint);
  }

  componentWillUnmount() {
    window.removeEventListener('afterprint', this.handleAfterPrint);
  }

  handlePrintClick = () => {
    window.print();
  };

  handleAfterPrint = () => {
    const content = document.documentElement.textContent; // Capture the textual content of the HTML

    this.setState({
      isPopoverVisible: true,
      popoverContent: content,
    });
  };

  showDrawer = () => {
    this.setState({
      isDrawerVisible: true,
    });
  };

  hideDrawer = () => {
    this.setState({
      isDrawerVisible: false,
    });
  };

  render() {
    const { isPopoverVisible, popoverContent, isDrawerVisible } = this.state;

    return (
      <div>
        <button onClick={this.handlePrintClick}>Print</button>

        {isPopoverVisible && (
          <Popover>
            <div>{popoverContent}</div>
          </Popover>
        )}

        <button onClick={this.showDrawer}>Open Drawer</button>
        {isDrawerVisible && (
          <Drawer onClose={this.hideDrawer}>
            {/* Drawer Content */}
          </Drawer>
        )}
      </div>
    );
  }
}

ReactDOM.render(<PrintPopover />, document.getElementById('root'));
