interface ITodo {
	id: string;
	content: string;
	completed: boolean;
}

interface ITodoItemProps {
	key: string;
	todo: ITodo;
	editing?: boolean;
	onSave: (val: any) => void;
	onDestroy: () => void;
	onEdit: () => void;
	onCancel: (event: any) => void;
    onToggle: () => void;
    children?: ReactNode;
}

interface ITodoListItemProps {
	completed?: boolean;
	editing?: boolean;
}

interface ITodoFooterProps {
	count: number;
	completedCount: number;
	onClearCompleted: any;
	nowShowing: string;
	setShowing: (val: string) => void;
}

interface ITodoFooterItemProps {
	selected?: boolean
}

interface ILoginModal {
	active: boolean;
	backgroundClicked: () => void;
	children?: any;
}

interface INavProps {
	error: boolean;
}

interface ITodoButton {
	clicked?: () => void;
	children?: string;
}

interface ITodoFilterProps {
	clicked?: () => void;
	selected: boolean;
	children?: string;
}
