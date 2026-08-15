package com.shyxha.todo.dto;


public class DashboardStatsDto {

    private long totalTasks;
    private long completedTasks;
    private long pendingTasks;
    private long highPriorityTasks;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalTasks,
                             long completedTasks,
                             long pendingTasks,
                             long highPriorityTasks) {

        this.totalTasks = totalTasks;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.highPriorityTasks = highPriorityTasks;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getCompletedTasks() {
        return completedTasks;
    }

    public void setCompletedTasks(long completedTasks) {
        this.completedTasks = completedTasks;
    }

    public long getPendingTasks() {
        return pendingTasks;
    }

    public void setPendingTasks(long pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public long getHighPriorityTasks() {
        return highPriorityTasks;
    }

    public void setHighPriorityTasks(long highPriorityTasks) {
        this.highPriorityTasks = highPriorityTasks;
    }

}