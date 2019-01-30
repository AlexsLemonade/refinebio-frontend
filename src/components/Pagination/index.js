import React, { Component } from 'react';
import { getRange } from '../../common/helpers';
import './Pagination.scss';
import JumpToPageForm from './JumpToPageForm';

class Pagination extends Component {
  state = {
    paginating: false
  };

  paginate = page => {
    if (this.state.paginating) return;

    this.setState({ paginating: true }, async () => {
      await this.props.onPaginate(page);
      this.setState({ paginating: false });
    });
  };

  getPaginationRange(currentPage, totalPages) {
    if (currentPage <= 2) {
      return [2, 3];
    } else if (currentPage >= totalPages - 1) {
      return [totalPages - 2, totalPages - 1];
    } else {
      return [currentPage - 1, currentPage, currentPage + 1];
    }
  }

  renderPages() {
    const { totalPages, onPaginate, currentPage } = this.props;

    const pageArray =
      totalPages < 5
        ? getRange(totalPages)
        : this.getPaginationRange(currentPage, totalPages);

    return (
      <span>
        {totalPages < 5 ? null : (
          <span>
            <button
              disabled={this.state.paginating}
              onClick={() => this.paginate(1)}
              className={`pagination__page ${
                currentPage === 1 ? 'pagination__page--active' : ''
              }`}
            >
              1
            </button>
            {currentPage > 3 && (
              <span className="pagination__ellipsis">...</span>
            )}
          </span>
        )}
        {pageArray.map((page, i) => {
          return (
            <button
              key={i}
              disabled={this.state.paginating}
              onClick={() => this.paginate(page)}
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
            {currentPage < totalPages - 2 && (
              <span className="pagination__ellipsis">...</span>
            )}
            <button
              disabled={this.state.paginating}
              onClick={() => this.paginate(totalPages)}
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

    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <div className="mobile-p">
          <button
            disabled={this.state.paginating}
            onClick={() => this.paginate(currentPage - 1)}
            disabled={currentPage <= 1}
            className="pagination__ends"
          >
            &lt; Previous
          </button>
          {this.renderPages()}
          <button
            disabled={this.state.paginating}
            onClick={() => this.paginate(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="pagination__ends"
          >
            Next &gt;
          </button>
        </div>
        <div className="pagination__jumper">
          <JumpToPageForm onPaginate={onPaginate} totalPages={totalPages} />
        </div>
      </div>
    );
  }
}

export default Pagination;
