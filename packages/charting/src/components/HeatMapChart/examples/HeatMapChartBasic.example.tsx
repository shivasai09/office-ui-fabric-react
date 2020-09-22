import * as React from 'react';
import { HeatMapChart } from '../HeatMapChart';
import { IHeatMapChartProps } from '../HeatMapChart.types';

interface IHeatMapChartBasicExampleState {
  width: number;
  height: number;
}

export class HeatMapChartBasicExample extends React.Component<{}, IHeatMapChartBasicExampleState> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props);
    this.state = {
      width: 450,
      height: 350,
    };
  }
  public render(): React.ReactNode {
    const rootStyle = { width: `${this.state.width}px`, height: `${this.state.height}px` };
    const HeatMapData: IHeatMapChartProps['data'] = [
      {
        value: 16,
        legend: '0-33%',
        data: [
          {
            x: 'A',
            y: 'V1',
            value: 6,
          },
          {
            x: 'B',
            y: 'V2',
            value: 7,
          },
          {
            x: 'C',
            y: 'V3',
            value: 32,
          },
          {
            x: 'D',
            y: 'V4',
            value: 15,
          },
          {
            x: 'E',
            y: 'V5',
            value: 22,
          },
          {
            x: 'F',
            y: 'V6',
            value: 2,
          },
        ],
      },
      {
        value: 50,
        legend: '34-64%',
        data: [
          {
            x: 'A',
            y: 'V2',
            value: 37,
          },
          {
            x: 'B',
            y: 'V3',
            value: 37,
          },
          {
            x: 'C',
            y: 'V4',
            value: 57,
            rectText: '57%',
          },
          {
            x: 'D',
            y: 'V5',
            value: 46,
            rectText: '>30%',
          },
          {
            x: 'E',
            y: 'V6',
            value: 50,
            rectText: '>30%',
          },
          {
            x: 'F',
            y: 'V1',
            value: 49,
            rectText: '4 quat',
          },
        ],
      },
      {
        value: 80,
        legend: '65-100%',
        data: [
          {
            x: 'A',
            y: 'V3',
            value: 96,
            rectText: 96,
          },
          {
            x: 'B',
            y: 'V4',
            value: 67,
            rectText: '<70%',
          },
          {
            x: 'C',
            y: 'V5',
            value: 70,
            rectText: '<90%',
          },
          {
            x: 'D',
            y: 'V6',
            value: 81,
            rectText: '<90%',
            ratio: [34432, 234324],
            descriptionMessage:
              'Measures shared workspaces that are engaged with over 100 members that is less than 3 months old',
          },
          {
            x: 'E',
            y: 'V1',
            value: 100,
            rectText: '100%',
          },
          {
            x: 'F',
            y: 'V2',
            value: 90,
            rectText: 'hello',
          },
        ],
      },
    ];
    return (
      <>
        <label>change Width:</label>
        <input type="range" value={this.state.width} min={200} max={1000} onChange={this._onWidthChange} />
        <label>change Height:</label>
        <input type="range" value={this.state.height} min={200} max={1000} onChange={this._onHeightChange} />
        <div style={rootStyle}>
          <HeatMapChart
            data={HeatMapData}
            xAxisTickCount={3}
            width={this.state.width}
            height={this.state.height}
            colorScaleMaxDomainValue={100}
            colorScaleMinDomainValue={0}
            colorScaleMaxRangeValue={'#091653'}
            colorScaleMinRangeValue={'#E9E9E9'}
          />
        </div>
      </>
    );
  }
  private _onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ width: parseInt(e.target.value, 10) });
  };
  private _onHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ height: parseInt(e.target.value, 10) });
  };
}
