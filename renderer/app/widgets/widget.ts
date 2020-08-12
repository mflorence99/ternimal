export interface Widget {
  splitID: string;
  widgetCaps?: WidgetCaps;
  widgetCommands?: WidgetCommand[];
  widgetLaunch: WidgetLaunch;
  widgetMenuItems?: WidgetCommand[][];
  widgetPrefs?: WidgetPrefs;
  widgetStatus?: WidgetStatus;
}

export interface WidgetCaps {
  isOpaque?: boolean;
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

export interface WidgetStatus {
  gotoCWD?: string;
  showCWD: boolean;
}
