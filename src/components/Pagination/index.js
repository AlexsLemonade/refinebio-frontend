import React, { Component } from 'react';
import './Pagination.scss';

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: ''
    };
  }

  handleJumpPageSubmit(e) {
    const { totalPages, onPaginate } = this.props;
    e.preventDefault();
    if (this.state.pageNumber <= totalPages) {
      onPaginate(this.state.pageNumber);
    }
  }

  handleInputChange(e) {
    const { target: { value } } = e;
    this.setState({ pageNumber: value });
  }

  renderPages() {
    const { totalPages, onPaginate, currentPage } = this.props;
    let pageArray = [];

    if (totalPages < 5) {
      for (var i = 1; i <= totalPages; i++) {
        pageArray.push(i);
      }
    } else {
      pageArray = [1, 2, 3];
    }

    return (
      <span>
        {pageArray.map((page, i) => {
          return (
            <button
              key={i}
              onClick={() => onPaginate(page)}
              className={`pagination__page ${
                currentPage === page ? 'pagination__page--active' : ''
              }`}
            >
              {page}
            </button>
          );
        })}
        {totalPages < 5 ? null : (
          <span>
            <span className="pagination__ellipsis">...</span>
            <button
              key={i}
              onClick={() => onPaginate(totalPages)}
              className={`pagination__page ${
                currentPage === totalPages ? 'pagination__page--active' : ''
              }`}
            >
              {totalPages}
            </button>
          </span>
        )}
      </span>
    );
  }

  render() {
    const { onPaginate, totalPages, currentPage } = this.props;

    return (
      <div className="pagination">
        <div>
          <button
            onClick={() => onPaginate(currentPage - 1)}
            disabled={currentPage <= 1}
            className="pagination__ends"
          >
            &lt; Previous
          </button>
          {this.renderPages()}
          <button
            onClick={() => onPaginate(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="pagination__ends"
          >
            Next &gt;
          </button>
        </div>
        <div className="pagination__jumper">
          <form onSubmit={this.handleJumpPageSubmit.bind(this)}>
            <label>
              Jump to page
              <input
                id="pageNumber"
                name="pageNumber"
                className="pagination__input"
                type="number"
                min="1"
                onChange={this.handleInputChange.bind(this)}
                value={this.state.pageNumber}
              />
            </label>
          </form>
        </div>
      </div>
    );
  }
}

export default Pagination;
