import { CartesianChart, IChildProps } from '@uifabric/charting';
import { scaleLinear as d3ScaleLinear } from 'd3-scale';
import { classNamesFunction, getId } from 'office-ui-fabric-react/lib/Utilities';
import { DirectionalHint } from 'office-ui-fabric-react/lib/components/Callout';
import { IProcessedStyleSet } from 'office-ui-fabric-react/lib/Styling';
import * as React from 'react';
import { IHeatMapChartProps, IHeatMapChartStyleProps, IHeatMapChartStyles } from './HeatMapChart.types';
import { ILegend, Legends } from '../Legends/index';
import { ChartTypes, XAxisTypes, YAxisType } from '../../utilities/utilities';
import { IHeatMapChartData, IHeatMapChartDataPoint } from '../../types';
import { IModifiedCartesianChartProps } from '../CommonComponents';
import { Target } from 'office-ui-fabric-react';

type FlattenData = IHeatMapChartDataPoint & {
  legend: string;
};
interface IRectRef {
  data: FlattenData;
  refElement: SVGGElement;
}
type RectanglesGraphData = { [key: string]: FlattenData[] };
interface IHeatMapChartState {
  /**
   * determines if the legend any of the legend is selected or not
   * @default false
   */
  isLegendSelected: boolean;
  /**
   * contains the seleted legend string
   */
  activeLegend: string;
  /**
   * determines if the legend is hovered or not
   * @default false
   */
  isLegendHovered: boolean;
  /**
   * determines wethere to show or hide the callout
   * @default false
   */
  isCalloutVisible: boolean;
  /**
   * y value to be shown in callout
   */
  calloutYValue: string;
  /**
   * legend title to be shown in callout
   */
  calloutLegend: string;
  /**
   * color of the text in the callout
   */
  calloutTextColor: string;
  /**
   * The target that the Callout should try to position itself based on
   */
  target: Target;
  /**
   * ratio to show in the callout
   */
  ratio: [number, number] | null;

  /**
   * description message to show in the callout
   */
  descriptionMessage: string;
}
const getClassNames = classNamesFunction<IHeatMapChartStyleProps, IHeatMapChartStyles>();
export class HeatMapChartBase extends React.Component<IHeatMapChartProps, IHeatMapChartState> {
  private _classNames: IProcessedStyleSet<IHeatMapChartStyles>;
  private _stringXAxisDataPoints: string[];
  private _stringYAxisDataPoints: string[];
  private _dataSet: RectanglesGraphData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _colorScale: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _xAxisScale: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _yAxisScale: any;
  /**
   * This array contains ref for all the rectangles
   * drawn inside the chard
   */
  private _rectRefArray: { [key: string]: IRectRef } = {};
  private _tootipId = getId('tooltip');
  public constructor(props: IHeatMapChartProps) {
    super(props);
    /**
     * below funciton creates a new data set from the prop
     * @data and also finds all the unique x-axis datapoints
     * and y-axis datapoints(which will render in the axis in graph)
     *  and assign all of them to private variabel _dataSet , _stringXAxisDatapoints,
     * _stringYAxisDataPoint rescpetively
     */
    this._createNewDataSet();
    this._colorScale = this._getColorScale();
    this.state = {
      isLegendSelected: false,
      activeLegend: '',
      isLegendHovered: false,
      isCalloutVisible: false,
      target: null,
      calloutLegend: '',
      calloutTextColor: '',
      calloutYValue: '',
      ratio: null,
      descriptionMessage: '',
    };
  }
  public render(): React.ReactNode {
    const { data } = this.props;
    this._classNames = getClassNames(this.props.styles!, { theme: this.props.theme! });
    const calloutProps: IModifiedCartesianChartProps['calloutProps'] = {
      isBeakVisible: false,
      gapSpace: 8,
      ...this.props.calloutProps,
      isCalloutVisible: this.state.isCalloutVisible,
      id: this._tootipId,
      YValue: this.state.calloutYValue,
      legend: this.state.calloutLegend,
      color: this.state.calloutTextColor,
      target: this.state.target,
      styles: this._classNames.subComponentStyles.calloutStyles,
      directionalHint: DirectionalHint.bottomLeftEdge,
    };
    const chartHoverProps: IModifiedCartesianChartProps['chartHoverProps'] = {
      ...(this.state.ratio && {
        ratio: this.state.ratio,
      }),
      descriptionMessage: this.state.descriptionMessage,
    };
    return (
      <CartesianChart
        {...this.props}
        points={data}
        chartType={ChartTypes.HeatMapChart}
        xAxisType={XAxisTypes.StringAxis}
        yAxisType={YAxisType.StringAxis}
        calloutProps={calloutProps}
        chartHoverProps={chartHoverProps}
        styles={this._classNames.subComponentStyles!.cartesianStyles}
        datasetForXAxisDomain={this._stringXAxisDataPoints}
        stringDatasetForYAxisDomain={this._stringYAxisDataPoints}
        xAxisTickCount={this._stringXAxisDataPoints.length}
        xAxistickSize={0}
        legendBars={this._createLegendBars()}
        /* eslint-disable react/jsx-no-bind */
        // eslint-disable-next-line react/no-children-prop
        children={(props: IChildProps) => {
          this._xAxisScale = props.xScale;
          this._yAxisScale = props.yScale;
          return this._createRectangles();
        }}
      />
    );
  }

  private _getOpacity = (legendTitle: string): string => {
    let shouldHighlight = true;
    if (this.state.isLegendHovered || this.state.isLegendSelected) {
      shouldHighlight = legendTitle === this.state.activeLegend;
    }
    return shouldHighlight ? '1' : '0.1';
  };

  private _rectRefCallback = (rectElement: SVGGElement, index: number | string, dataPointObject: FlattenData): void => {
    this._rectRefArray[index] = { data: dataPointObject, refElement: rectElement };
  };

  private _onRectFocus = (id: string, data: FlattenData): void => {
    this.setState({
      target: this._rectRefArray[id].refElement,
      isCalloutVisible: true,
      calloutYValue: `${data.rectText}`,
      calloutTextColor: this._colorScale(data.value),
      calloutLegend: data.legend,
      ratio: data.ratio || null,
      descriptionMessage: data.descriptionMessage || '',
    });
  };

  private _onRectMouseOver = (id: string, data: FlattenData, mouseEvent: React.MouseEvent<SVGGElement>): void => {
    mouseEvent.persist();
    this.setState({
      target: this._rectRefArray[id].refElement,
      isCalloutVisible: true,
      calloutYValue: `${data.rectText}`,
      calloutTextColor: this._colorScale(data.value),
      calloutLegend: data.legend,
      ratio: data.ratio || null,
      descriptionMessage: data.descriptionMessage || '',
    });
  };

  private _onRectBlurOrMouseOut = (): void => {
    this.setState({
      isCalloutVisible: false,
    });
  };

  private _createRectangles = (): React.ReactNode => {
    const rectangles: JSX.Element[] = [];
    const yAxisDataPoints = this._stringYAxisDataPoints.slice().reverse();
    /**
     * yAxisDataPoint is noting but the DataPoint
     * which will be rendered on the y-axis
     */
    yAxisDataPoints.forEach((yAxisDataPoint: string, index1: number) => {
      /**
       * dataPointObject is an object where it contains information on single
       * data point such as x, y , value, rectText property of the rectangle
       */
      this._dataSet[yAxisDataPoint].forEach((dataPointObject: FlattenData, index2: number) => {
        const id = `${index1}${index2}`;
        const rectElement: JSX.Element = (
          <g
            key={id}
            data-is-focusable={true}
            fillOpacity={this._getOpacity(dataPointObject.legend)}
            transform={`translate(${this._xAxisScale(dataPointObject.x)}, ${this._yAxisScale(dataPointObject.y)})`}
            ref={(gElement: SVGGElement) => {
              this._rectRefCallback(gElement, id, dataPointObject);
            }}
            onFocus={this._onRectFocus.bind(this, id, dataPointObject)}
            onBlur={this._onRectBlurOrMouseOut}
            onMouseOver={this._onRectMouseOver.bind(this, id, dataPointObject)}
            onMouseOut={this._onRectBlurOrMouseOut}
          >
            <rect
              fill={this._colorScale(dataPointObject.value)}
              width={this._xAxisScale.bandwidth()}
              height={this._yAxisScale.bandwidth()}
            />
            <text
              dominantBaseline={'middle'}
              textAnchor={'middle'}
              fill={'white'}
              fontSize={'14px'}
              transform={`translate(${this._xAxisScale.bandwidth() / 2}, ${this._yAxisScale.bandwidth() / 2})`}
            >
              {dataPointObject.rectText}
            </text>
          </g>
        );
        rectangles.push(rectElement);
      });
    });
    return rectangles;
  };
  /**
   * when the legend is hovered we need to highlight
   * all the rectangles which fall under that category
   * and un highlight the rest of them, this functionality
   * should happen only when there is not legendSelected
   * @param legendTitle
   */
  private _onLegendHover = (legendTitle: string): void => {
    if (this.state.isLegendSelected === false) {
      this.setState({
        activeLegend: legendTitle,
        isLegendHovered: true,
      });
    }
  };

  /**
   * when the mouse is out from the legend , we need
   * to show the graph in initial mode. isLegendFocused will
   * be useful at the scenario where mouseout happend for
   * the legends which are in overflow card
   * @param isLegendFocused
   */
  private _onLegendLeave = (isLegendFocused?: boolean): void => {
    if (!!isLegendFocused || this.state.isLegendSelected === false) {
      this.setState({
        activeLegend: '',
        isLegendHovered: false,
        isLegendSelected: isLegendFocused ? false : this.state.isLegendSelected,
      });
    }
  };
  /**
   * @param legendTitle
   * when the legend is clicked we need to highlight
   * all the rectangles which fall under that category
   * and un highlight the rest of them
   */
  private _onLegendClick = (legendTitle: string): void => {
    /**
     * check if the legend is already selceted,
     * if yes, then check if the consumer has clicked already
     * seleceted legend if yes un-select the legend, else
     * set the acitve legend state to legendTitle
     *
     * if legend is not alredy selceted, simply set the isLegendSelected to true
     * and the active legend to the legendTitle of selected legend
     */
    if (this.state.isLegendSelected) {
      if (this.state.activeLegend === legendTitle) {
        this.setState({
          activeLegend: '',
          isLegendSelected: false,
        });
      } else {
        this.setState({ activeLegend: legendTitle });
      }
    } else {
      this.setState({
        activeLegend: legendTitle,
        isLegendSelected: true,
        isLegendHovered: false,
      });
    }
  };
  private _createLegendBars = (): JSX.Element => {
    const { data } = this.props;
    const legends: ILegend[] = [];
    data.forEach((item: IHeatMapChartData) => {
      const legend: ILegend = {
        title: item.legend,
        color: this._colorScale(item.value),
        action: () => {
          this._onLegendClick(item.legend);
        },
        hoverAction: () => {
          this._onLegendHover(item.legend);
        },
        onMouseOutAction: (isLegendSelected?: boolean) => {
          this._onLegendLeave(isLegendSelected);
        },
      };
      legends.push(legend);
    });
    return <Legends legends={legends} />;
  };

  private _getColorScale = () => {
    const {
      colorScaleMaxDomainValue,
      colorScaleMinDomainValue,
      colorScaleMaxRangeValue,
      colorScaleMinRangeValue,
    } = this.props;
    return d3ScaleLinear()
      .domain([colorScaleMinDomainValue, colorScaleMaxDomainValue])
      .range([(colorScaleMinRangeValue as unknown) as number, (colorScaleMaxRangeValue as unknown) as number]);
  };

  /**
   * This will create a new data set based on the prop
   * @data
   * We will be using This data set to contsruct our rectangles
   * in the chart, we use this data set becuase, when we loop in this
   * data and build the heat map, it will support accessibility as
   * specified in the figma
   */
  private _createNewDataSet = () => {
    const { data } = this.props;
    const flattenData: FlattenData[] = [];
    /**
     * below for each loop will store all the datapoints in the one array.
     * basically it will flatten the nestesd array (data prop) into single array
     * of object. where each object contains x, y, rectText , value and legend propety of single
     * data point.
     */
    data.forEach((item: IHeatMapChartData) => {
      item.data.forEach((point: IHeatMapChartDataPoint) => {
        flattenData.push({ ...point, legend: item.legend });
      });
    });
    const yPoints: RectanglesGraphData = {};
    const uniqueYPoints: { [key: string]: '1' } = {};
    const uniqueXPoints: { [key: string]: '1' } = {};
    flattenData.forEach((item: FlattenData) => {
      uniqueXPoints[item.x] = '1';
      uniqueYPoints[item.y] = '1';
      const pos = item.y;
      /** we will check if the property(pos) is already there in object, if  Yes,
       *  then we will append the item in the Array related to the pos, if not
       *  then we will simply append the item in the new Array and
       *  assign that array to the  property (pos) in the Object
       *  and finally we will get the array of Objects associated to each
       *  property (which is nothing but y data point) and object in the
       *  array are noting but x data points associated to the property y
       */
      if (yPoints[pos]) {
        yPoints[pos] = [...yPoints[pos], item];
      } else {
        yPoints[pos] = [item];
      }
    });
    /**
     * we will now sort(ascending) the array's of y data point based on the x value
     */
    Object.keys(yPoints).forEach((item: string) => {
      yPoints[item].sort((a: IHeatMapChartDataPoint, b: IHeatMapChartDataPoint) =>
        a.x.toLowerCase() > b.x.toLowerCase() ? 1 : -1,
      );
    });
    /**
     * assigning new data set
     */
    this._dataSet = yPoints;
    /**
     * These are the x axis data points which will get rendered in the
     * x axis in graph
     */
    this._stringYAxisDataPoints = Object.keys(uniqueYPoints).sort((a: string, b: string) =>
      a.toLowerCase() > b.toLowerCase() ? 1 : -1,
    );
    /**
     * These are the y axis data points which will get rendered in the
     * y axis in the graph
     */
    this._stringXAxisDataPoints = Object.keys(uniqueXPoints).sort((a: string, b: string) =>
      a.toLowerCase() > b.toLowerCase() ? 1 : -1,
    );
  };
}
