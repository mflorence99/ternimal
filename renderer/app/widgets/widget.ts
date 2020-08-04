export interface Widget {
  commands?: WidgetCommand[];
  launch: WidgetLaunch;
  menuItems?: WidgetCommand[];
  prefs?: WidgetPrefs;
  splitID: string;
}

export interface WidgetCommand {
  command: string;
  description?: string;
  icon: string[];
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
