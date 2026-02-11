export type SideBarItem = {
  sub_id: number;
  mod_id: number;
  sub_txt_key: string;
  sub_txt_name: string;
  sub_path_to: string;
  sub_int_order: number;
  sub_sta_state: number;
  sub_dat_created_at: string;
  sub_dat_updated_at: string;
  sub_dat_deleted_at: string | null;
  sub_icon: string | null;
};

export type NavItem = {
  mod_id: number;
  mod_txt_key: string;
  mod_txt_name: string;
  mod_path_to: string;
  mod_int_order: number;
  mod_sta_state: number;
  mod_dat_created_at: string;
  mod_dat_updated_at: string;
  mod_dat_deleted_at: string | null;
  mod_submodules?: SideBarItem[];
};
