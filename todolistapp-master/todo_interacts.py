from databasemodels import TodoList, Tags
from sqlalchemy import select
from createengine import sessiondatabase as sdb
from datetime import datetime



def get_todo_function(user_id: int):
    todolist = []
    stmt = select(TodoList).where(TodoList.user_id == user_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        todolist.append(
            {'todo_text': user_obj.todo_text,
             'todo_description': user_obj.todo_description,
             'todo_made_time': user_obj.todo_made_time,
             'todo_date': user_obj.todo_date,
             'todo_date_overdue': user_obj.todo_date_overdue,
             'todo_done': user_obj.todo_done,
             # get the first tag information from tags with the same todolist_id
                'todo_tags': [user_obj.todo_tags[0].tag_name, user_obj.todo_tags[0].tag_color],
             'user_id': user_obj.user_id,
             'id': user_obj.id
             }
        )
    return todolist


def add_to_todo(todo_text,
                user_id,
                todo_date=datetime.fromisoformat('0001-01-01'),
                todo_description=None,
                todo_date_overdue=False,
                todo_done=False,
                todo_tags=None,
                todo_tags_color=None
                ):
    if todo_date == datetime.fromisoformat('0001-01-01'):
        todo_date_overdue = False
    elif datetime.now() > todo_date:
        todo_date_overdue = True

    new_todo = TodoList(
        todo_text=todo_text,
        todo_description=todo_description,
        todo_made_time=datetime.now(),
        todo_date=todo_date,
        todo_date_overdue=todo_date_overdue,
        todo_done=todo_done,
        user_id=user_id,
        todo_tags=[Tags(tag_name=todo_tags, tag_color=todo_tags_color)]
    )
    sdb.add(new_todo)
    sdb.commit()


def change_todo_done(todo_id, todo_done):
    stmt = select(TodoList).where(TodoList.id == todo_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        user_obj.todo_done = todo_done
    sdb.commit()


def change_todo_date(todo_id, todo_date):
    stmt = select(TodoList).where(TodoList.id == todo_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        user_obj.todo_date = todo_date
    sdb.commit()


def change_todo_text(todo_id, todo_text):
    stmt = select(TodoList).where(TodoList.id == todo_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        user_obj.todo_text = todo_text
    sdb.commit()


def delete_todo(todo_id):
    stmt = select(TodoList).where(TodoList.id == todo_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        sdb.delete(user_obj)
    sdb.commit()


def change_todo_to_done(todo_id, todo_done):
    stmt = select(TodoList).where(TodoList.id == todo_id)
    result = sdb.execute(stmt)
    for user_obj in result.scalars():
        user_obj.todo_done = todo_done
    sdb.commit()
