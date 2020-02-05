import React from 'react';
import ExpandIcon from '../../../common/icons/expand.svg';
import CollapseIcon from '../../../common/icons/collapse.svg';
import Button from '../../../components/Button';

/**
 * Expand/Collapse button
 */
export default function ExpandButton({ expanded, onClick }) {
  return (
    <Button
      onClick={onClick}
      buttonStyle="transparent"
      className="experiment__expand-button"
    >
      {!expanded ? (
        <>
          <img src={ExpandIcon} alt="expand icon" />
          Expand Table
        </>
      ) : (
        <>
          <img src={CollapseIcon} alt="collapse icon" />
          Collapse Table
        </>
      )}
    </Button>
  );
}
