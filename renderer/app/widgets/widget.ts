export interface Widget {
  splitID: string;
  widgetCommands?: WidgetCommand[];
  widgetLaunch: WidgetLaunch;
  widgetMenuItems?: WidgetCommand[][];
  widgetPrefs?: WidgetPrefs;
  widgetStatus?: WidgetStatus;
}

export interface WidgetCommand {
  accelerator?: WidgetCommandAccelerator;
  command: string;
  description?: string;
  icon?: string[];
  if?: string;
  unless?: string;
}

export interface WidgetCommandAccelerator {
  ctrlKey?: boolean;
  description: string;
  key: string;
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

export interface WidgetStatus {
  gotoCWD?: string;
  showCWD: boolean;
}
