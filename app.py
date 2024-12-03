from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import datetime

app = Flask(__name__, static_folder='frontend/build')  # Point to the React build folder
CORS(app)  # Enable CORS to allow requests from the frontend

# Store tasks, results, and logs
tasks = []
results = []
task_logs = []

@app.route('/add_task', methods=['POST'])
def add_task():
    data = request.get_json()  # Parse the incoming JSON data
    task = {
        "id": len(tasks) + 1,
        "name": data['name'],
        "execution_time": data['execution_time'],
        "deadline": data['deadline'],
        "priority": data['priority']
    }
    tasks.append(task)  # Add the new task to the task list
    task_logs.append({"task_id": task["id"], "status": "Added", "timestamp": str(datetime.datetime.now())})
    return jsonify({"task": task}), 201  # Return the added task

@app.route('/get_tasks', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": tasks}), 200  # Return all tasks

@app.route('/delete_task', methods=['DELETE'])
def delete_task():
    task_id = request.args.get('id')
    task_id = int(task_id)
    global tasks
    tasks = [task for task in tasks if task["id"] != task_id]  # Remove task by id
    task_logs.append({"task_id": task_id, "status": "Deleted", "timestamp": str(datetime.datetime.now())})
    return jsonify({"message": "Task deleted"}), 200

@app.route('/update_task', methods=['PUT'])
def update_task():
    data = request.get_json()  # Parse the incoming JSON data
    task_id = data['id']
    updated_task = None
    for task in tasks:
        if task['id'] == task_id:
            task['name'] = data['name']
            task['execution_time'] = data['execution_time']
            task['deadline'] = data['deadline']
            task['priority'] = data['priority']
            updated_task = task
            break
    if updated_task:
        task_logs.append({"task_id": task_id, "status": "Updated", "timestamp": str(datetime.datetime.now())})
        return jsonify({"task": updated_task}), 200
    else:
        return jsonify({"message": "Task not found"}), 404

@app.route('/start_scheduler', methods=['POST'])
def start_scheduler():
    global results
    if not tasks:  # Check if there are no tasks
        return jsonify({"message": "No tasks available to schedule"}), 400
    
    # Scheduler logic (First-Come First-Served Example)
    results = []
    sorted_tasks = sorted(tasks, key=lambda task: task['priority'], reverse=True)  # Sort tasks by priority
    for task in sorted_tasks:
        status = "Completed" if task['execution_time'] <= task['deadline'] else "Missed Deadline"
        results.append({"id": task['id'], "name": task['name'], "status": status})
        task_logs.append({"task_id": task['id'], "status": f"Executed: {status}", "timestamp": str(datetime.datetime.now())})
    return jsonify({"message": "Scheduler started", "results": results}), 200

@app.route('/get_results', methods=['GET'])
def get_results():
    return jsonify(results), 200  # Return results of the scheduler

@app.route('/get_task_logs', methods=['GET'])
def get_task_logs():
    return jsonify({"logs": task_logs}), 200  # Return task logs (history)

@app.route('/')
@app.route('/<path:path>')
def serve(path=''):
    if path and (path.startswith('static/') or '.' in path):
        return send_from_directory(os.path.join(app.static_folder, 'static'), path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
