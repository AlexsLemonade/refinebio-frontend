import React from 'react';

import classnames from 'classnames';
import { IoMdSearch } from 'react-icons/io';

const DropdownSearch = ({
  options = [],
  selectedOption = '',
  onChange,
  disabled = false,
  label = x => x,
  placeholder = '',
}) => {
  const [query, setQuery] = React.useState('');
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [filteredOptions, setFilteredOptions] = React.useState([...options]);
  const [highlighted, setHighlighted] = React.useState(null);
  const inputRef = React.useRef();
  const scrollRef = React.useRef();
  const highlightedRef = React.useRef();

  const handleFocus = () => {
    setOpenDropdown(true);
    inputRef.current.select();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setOpenDropdown(false);
    }, 150);
  };

  const handleSelection = selected => {
    setQuery(label(selected));
    setHighlighted(label(selected));
    inputRef.current.blur();
    onChange(selected);
  };

  const isHighlighted = option => {
    return highlighted && label(option) === label(highlighted);
  };

  const getHighlightedIndex = () => {
    return filteredOptions.indexOf(highlighted) || 0;
  };

  // highlighted ref is actually the last highlighted element
  // this can probably be cleaned up
  const goToHighlighted = (isNext = true) => {
    if (highlightedRef.current) {
      const {
        current: { previousSibling, nextSibling },
      } = highlightedRef;
      const sibling = isNext ? nextSibling : previousSibling;
      const { offsetTop: elTop, offsetHeight: elHeight } =
        sibling || highlightedRef.current;
      const {
        current: {
          scrollTop,
          offsetHeight: scrollWindowHeight,
          clientHeight: scrollWindowClientHeight,
        },
      } = scrollRef;
      const windowOffset = scrollWindowHeight - scrollWindowClientHeight;
      const nextScrollTo = elTop + elHeight - scrollWindowHeight + windowOffset;
      const scrollTo = isNext ? nextScrollTo : elTop;

      // check if highlighted is outside of viewport
      const below = scrollTop + scrollWindowHeight <= elTop + elHeight;
      const above = scrollTop > elTop;

      if ((isNext && below) || (!isNext && above)) {
        scrollRef.current.scrollTo(0, scrollTo);
      }
    }
  };

  const handlePreviousHighlighted = () => {
    if (!highlighted) {
      setHighlighted(filteredOptions[0]);
    } else {
      const index = getHighlightedIndex();
      const newIndex = Math.max(index - 1, 0);
      setHighlighted(filteredOptions[newIndex]);
    }
    goToHighlighted(false);
  };

  const handleNextHighlighted = () => {
    if (!highlighted) {
      setHighlighted(filteredOptions[0]);
    } else {
      const index = getHighlightedIndex();
      const newIndex = Math.min(index + 1, filteredOptions.length - 1);
      setHighlighted(filteredOptions[newIndex]);
    }
    goToHighlighted();
  };

  const handleKeyup = e => {
    // up arrow keyCode
    if (e.keyCode === 38) handlePreviousHighlighted();
    // down arrow keyCode
    if (e.keyCode === 40) handleNextHighlighted();
    // return keyCode
    if (e.keyCode === 13) handleSelection(highlighted);
  };

  // handle filtering of dropdown options
  React.useEffect(() => {
    // should only eliminate possibilities

    if (query !== '') {
      // fuzzy find to see if there are any matches
      const newFilteredOptions = options.filter(option => {
        // going to need to define what search means
        const lquery = query.toLowerCase();
        const loption = label(option).toLowerCase();
        return loption.indexOf(lquery) > -1;
      });

      setFilteredOptions(newFilteredOptions);
      setHighlighted(newFilteredOptions[0] || null);
    } else {
      setFilteredOptions([...options]);
    }
  }, [query, options, label, setHighlighted]);

  return (
    <div className="dropdown-search">
      <div className="dropdown-search__wrap">
        <div className="dropdown-search__wrap__clear">
          <IoMdSearch className="icon" />
        </div>
        <input
          className="dropdown-search__input"
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyUp={handleKeyup}
          placeholder={placeholder}
        />
      </div>
      <ul
        ref={scrollRef}
        className={classnames({
          'dropdown-search__dropdown': true,
          'dropdown-search__dropdown__open': openDropdown,
        })}
      >
        {filteredOptions.map(option => {
          return (
            <li
              className={classnames('dropdown-search__dropdown-item', {
                'dropdown-search__dropdown-item__highlight': isHighlighted(
                  option
                ),
              })}
              key={label(option)}
              ref={el => {
                if (isHighlighted(option)) {
                  highlightedRef.current = el;
                }
              }}
            >
              <button
                type="button"
                onClick={() => handleSelection(option)}
                onMouseEnter={() => setHighlighted(option)}
              >
                {label(option)}
              </button>
            </li>
          );
        })}
        {filteredOptions.length === 0 && (
          <li className="dropdown-search__dropdown-empty">Empty</li>
        )}
      </ul>
    </div>
  );
};

export default DropdownSearch;
