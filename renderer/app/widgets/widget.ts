export interface Widget {
  splitID: string;
  widgetCommands?: WidgetCommand[];
  widgetLaunch: WidgetLaunch;
  widgetMenuItems?: WidgetCommand[][];
  widgetPrefs?: WidgetPrefs;
}

export interface WidgetCommand {
  command: string;
  description?: string;
  icon?: string[];
  if?: string;
  unless?: string;
}

export interface WidgetLaunch {
  description: string;
  icon: string[];
  implementation: string;
}

export interface WidgetPrefs {
  description: string;
  implementation: string;
}
