export interface Widget {
  commands?: WidgetCommand[];
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
