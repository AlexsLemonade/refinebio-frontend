import React from 'react';

/**
 * Hightlight portions of a text.
 * thanks to https://stackoverflow.com/a/43235785/763705
 */
export default function HighlightedText({ text, highlight }) {
  if (!highlight) return text;

  // Split on highlight term and include term into parts, ignore case
  let parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {' '}
      {parts.map((part, i) => (
        <span
          key={i}
          className={
            part && part.toLowerCase() === highlight.toLowerCase()
              ? 'text-highlight'
              : ''
          }
        >
          {part}
        </span>
      ))}{' '}
    </span>
  );
}
