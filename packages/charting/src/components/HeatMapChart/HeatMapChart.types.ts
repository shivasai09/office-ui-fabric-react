import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { ICalloutContentStyleProps, ICalloutContentStyles } from 'office-ui-fabric-react/lib/components/Callout';
import { IStyle } from 'office-ui-fabric-react/lib/Styling';
import {
  ICartesianChartStyleProps,
  ICartesianChartProps,
  ICartesianChartStyles,
} from '../CommonComponents/CartesianChart.types';
import { IHeatMapChartData } from '../../types';

export interface IHeatMapChartProps extends Pick<ICartesianChartProps, Exclude<keyof ICartesianChartProps, 'styles'>> {
  /**
   * data to provide for Heat Map
   */
  data: IHeatMapChartData[];
  /**
   * The min Domain  value For the color scale,
   * This value should map to the max range value
   */
  colorScaleMaxDomainValue: number;
  /**
   * The Max Domain  value For the Color Scale
   * This value should map to the min range value
   */
  colorScaleMinDomainValue: number;
  /**
   * The min Range Value for the color scale
   * This value should map to the min domain value
   */
  colorScaleMinRangeValue: string;
  /**
   * The Max Range Value for color scale
   * This value should map to the max domain value
   */
  colorScaleMaxRangeValue: string;
  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<IHeatMapChartStyleProps, IHeatMapChartStyles>;
}
export interface IHeatMapChartStyleProps extends ICartesianChartStyleProps {}
export interface IHeatMapChartStyles {
  root: IStyle;
  subComponentStyles: {
    cartesianStyles: IStyleFunctionOrObject<ICartesianChartStyleProps, ICartesianChartStyles>;
    calloutStyles: IStyleFunctionOrObject<ICalloutContentStyleProps, ICalloutContentStyles>;
  };
}
