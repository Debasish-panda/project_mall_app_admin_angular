export interface Menu {
    title: string; // name is mandatroy so we have not set nullable
    path?: string; //we set nullable because somewhere path is not mandatory
    icon?: string;
    type:string; //link or menu
    active?:boolean; //link is active or not
    children?:Menu[] //somewhere we have children so for that we created same Menu array;
}