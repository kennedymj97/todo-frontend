interface ITodo {
	id: number;
	title: string;
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