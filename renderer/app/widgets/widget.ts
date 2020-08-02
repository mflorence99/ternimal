export interface Widget {
  commands?: WidgetCommand[];
  launch: WidgetLaunch;
  menuItems?: WidgetCommand[];
  splitID: string;
}

export interface WidgetCommand {
  command: string;
  icon: string[];
  if?: string;
  tooltip?: string;
  unless?: string;
}

export interface WidgetLaunch {
  description: string;
  icon: string[];
  implementation: string;
}
