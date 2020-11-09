import React, { CSSProperties } from 'react';

type GridProps = {
  vCells: number,
  hCells: number,
  width: number,
  height: number,
};

function Grid(props: GridProps): React.ReactElement {
  const {
    vCells,
    hCells,
    width,
    height,
  } = props;

  const containerStyle: CSSProperties = {
    display: 'grid',
    width: `${width}px`,
    height: `${height}px`,
    gridTemplateColumns: `repeat(${hCells}, 1fr)`,
    gridTemplateRows: `repeat(${vCells}, 1fr)`,
  };

  const borderStyle: string = '1px solid rgba(0, 0, 0, 0.4)';

  const cellStyle: CSSProperties = {
    borderLeft: borderStyle,
    borderBottom: borderStyle,
  };

  const leftColumnCellStyle: CSSProperties = {
    borderLeft: '0px',
    borderBottom: borderStyle,
  };

  const lastRowCellStyle: CSSProperties = {
    borderLeft: borderStyle,
    borderBottom: '0px',
  };

  const leftBottomCellStyle: CSSProperties = {
    borderLeft: '0px',
    borderBottom: '0px',
  };

  const gridItems: React.ReactNode[] = [];
  for (let itemIndex = 0; itemIndex < vCells * hCells; itemIndex += 1) {
    // Generic row style.
    let style: CSSProperties = cellStyle;

    if (itemIndex === hCells * (vCells - 1)) {
      // Left bottom column.
      style = leftBottomCellStyle;
    } else if (itemIndex % hCells === 0) {
      // Left column.
      style = leftColumnCellStyle;
    } else if (itemIndex > hCells * (vCells - 1)) {
      // Bottom row.
      style = lastRowCellStyle;
    }

    gridItems.push((
      <div style={style} key={itemIndex} />
    ));
  }

  return (
    <div className="fade-in-10" style={containerStyle}>
      {gridItems}
    </div>
  );
}

export default Grid;
